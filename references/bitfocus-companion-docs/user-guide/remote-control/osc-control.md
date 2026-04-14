# OSC Control | Bitfocus Companion

Remote triggering can be done by sending OSC commands to port `12321` (the port number is configurable).

## Commands​

 *Press and release a button (run both down and up actions)*

 *Press the button (run down actions and hold)*

 *Release the button (run up actions)*

 *Trigger a left rotation of the button/encoder*

 *Trigger a right rotation of the button/encoder*

 *Set the current step of a button/encoder*

 *Change background color of button*

 *Change color of text on button*

 *Change text on a button*

 *Change custom variable value*

- `/surfaces/rescan` *Rescan for USB surfaces*

## Examples​

Press row 0, column 5 on page 1 down and hold
`/location/1/0/5/press`

Change button background color of row 0, column 5 on page 1 to red
`/location/1/0/5/style/bgcolor 255 0 0`
`/location/1/0/5/style/bgcolor rgb(255,0,0)`
`/location/1/0/5/style/bgcolor #ff0000`

Change the text of row 0, column 5 on page 1 to ONLINE
`/location/1/0/5/style/text ONLINE`

Change custom variable "cue" to value "intro":
`/custom-variable/cue/value intro`

## Deprecated Commands​

warning

These commands will be removed in a future release of Companion. There is equivalent functionality in the list above.

The following commands are deprecated and have replacements listed above. Support for this must be enabled in the settings for it to work

 *Press and release a button (run both down and up actions)*
 *Press the button (run down actions and hold)*
 *Release the button (run up actions)*
 *Change background color of button*
 *Change color of text on button*
 *Change text on a button*
- `/rescan 1` *Make Companion rescan for newly attached USB surfaces*