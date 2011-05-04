MoveGoogleHeaderLinks
====

This is a [Greasemonkey](http://www.greasespot.net) script for moving links into and/or out of the "more" link
dropdown on Google.

It may need to be tweaked as Google changes the structure and ids used in the header.

## Examples ##
Move the `Groups` link from the dropdown to the header, after the `Images` link:

    restoreGoogleHeaderLink("Groups", "Images");

Move the `Products` link from the dropdown to the end of the header:

    restoreGoogleHeaderLink("Products");

Move the `Gmail` link to the dropdown:

    hideGoogleHeaderLink("Gmail");

Remove the `News` link completely:

    removeGoogleHeaderLink("News");

