// ==UserScript==
// @name           Move Google Header Links
// @namespace      http://github.com/russelldavis
// @description    Move google header links into and/or out of the "more" link dropdown
// @include        http://*.google.com/*
// ==/UserScript==

// Convenience function for a simple single node xpath query
function xpathFirst(xpath, context)
{
    if (!context)
		context = document;

    var result = document.evaluate(xpath, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );

    if (!result)
    	return;

    return result.singleNodeValue;
}

// Convenience functions for dom insertion
function nodeCreate(tag)
{
	return document.createElement(tag);	
}

function nodePutBefore(nodInsert, nodRef)
{
	nodRef.parentNode.insertBefore(nodInsert, nodRef);
}

function nodePutAfter(nodInsert, nodRef)
{
	nodePutBefore(nodInsert, nodRef.nextSibling);
}

function nodeRemove(nod)
{
	if (nod)
	{
		nod.parentNode.removeChild(nod);
	}
}

////////////////////////////
// Main functionality below
////////////////////////////

// This returns an XPath predicate string that compares a node's normalized text to
// the text specified. Here, "normalized" means non-breaking spaces converted to spaces,
// and extra whitespace removed.
function xpNormEquals(sConvert, sCompare)
{
	return '[normalize-space(translate(' + sConvert + ', "\u00A0", " "))="' + sCompare + '"]';
}

function xpStrippedEquals(sConvert, sCompare)
{
	return '[translate(' + sConvert + ', " \u00A0", "")="' + sCompare + '"]';
}

function xpStrippedContains(sConvert, sCompare)
{
	return '[contains(translate(' + sConvert + ', " \u00A0", ""),"' + sCompare + '")]';
}

var g_nodBar;
var g_nodMore;

function isValidSearchPage()
{	
	g_nodBar = document.getElementById("gbar");
	if (!g_nodBar) return false;
	
	g_nodMore = xpathFirst('.//node()[@class="gb3"]', g_nodBar);
	if (!g_nodMore) return false;
	
	return true;
}

function getMainLink(name)
{
	if (name == null) return null;
	return xpathFirst('.//node()[@class="gb1"]' + xpNormEquals(".", name), g_nodBar);
}

function getSubLink(name)
{
	if (name == null) return null;
	return xpathFirst('.//node()[@class="gb2"]' + xpNormEquals(".", name), g_nodBar);
}

function addMainLink(elem, before)
{
	if (!elem) return null;
	if (before == null)
	{
		before = g_nodMore;	
	}
	elem.className = "gb1";
	before.parentNode.insertBefore(elem, before);
	return elem;
}

function addSubLink(elem, before)
{
	if (!elem) return null;
	elem.className = "gb2";
	var parent = before ? before.parentNode : g_nodMore.parentNode;
	parent.insertBefore(elem, before);
	return elem;
}

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

// Removes a link from the mainlink area with the text *name*
function removeMainLink(name)
{
	var link = getMainLink(name);
	nodeRemove(link);
}

// Removes a link from the sublink area with the text *name*
function removeSubLink(name)
{
	var link = getSubLink(name);
	nodeRemove(link);
}

// Moves a link with text *name* from the sublink area to the mainlink area
// before the mainlink with text *before*
function makeMainLink(name, before)
{
	var link = getSubLink(name);
	var nodBefore = getMainLink(before);
	addMainLink(link, nodBefore);	
}

// Moves a link with text *name* from the mainlink area to the sublink area
// before the sublink with text *before*
function makeSubLink(name, before)
{
	var link = getMainLink(name);
	var nodBefore = getSubLink(before);
	addSubLink(link, nodBefore);
}

// same as makeMainLink, but the 2nd parameter is the node to insert after, rather than before.
function makeMainLinkAfter(name, after)
{
	var link = getSubLink(name);
	var nodAfter = getMainLink(after);
	addMainLink(link, nodAfter ? nodAfter.nextSibling : null);	
}

// removes a link whether it's a mainlink or a sublink
function removeGoogleHeaderLink(name)
{
	removeMainLink(name);
	removeSubLink(name);	
}

// same as makeSubLink
function hideGoogleHeaderLink(name, before)
{
	makeSubLink(name, before);
}

// same as makeMainLinkAfter
function restoreGoogleHeaderLink(name, after)
{
	makeMainLinkAfter(name, after);
}

function main()
{
	if (!isValidSearchPage()) return;
	
	// Modify the code below to customize this script's behavior.
	// The first parameter is the name of the link you want to restore.
	// The second parameter is the the name of the link the restored link will be placed after.
	// If the second parameter is missing, the link will precede the "more" link.
	restoreGoogleHeaderLink("Groups", "Images");
	restoreGoogleHeaderLink("Products");
	restoreGoogleHeaderLink("Books");

	// You can also hide header links (e.g., move them into the "more" popup)
	// or get rid of them from the page altogether. Examples follow.
	hideGoogleHeaderLink("Gmail");
	removeGoogleHeaderLink("News");
}

main();
