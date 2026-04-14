# TCP / UDP Control | Bitfocus Companion

Remote triggering can be done by sending TCP or UDP commands. The port numbers must be setup in the [Settings](http://127.0.0.1:8000/user-guide/config/settings#tcp) before they can be used.

warning

TCP commands must be terminated with a newline character, i.e., \\n (0x0A) or \\r\\n (0x0D, 0x0A).

## Commands​

 *Set a surface to a specific page*

- `SURFACE <surface id> PAGE-UP`
 *Page up on a specific surface*

- `SURFACE <surface id> PAGE-DOWN`
 *Page down on a specific surface*

 *Press and release a button (run both down and up actions)*

 *Press the button (run down actions)*

 *Release the button (run up actions)*

 *Trigger a left rotation of the button/encoder*

 *Trigger a right rotation of the button/encoder*

 *Set the current step of a button/encoder*

 *Change text on a button*

 *Change text color on a button (#000000)*

 *Change background color on a button (#000000)*

 *Change custom variable value*

- `SURFACES RESCAN` *Make Companion rescan for USB surfaces*

## Examples​

Set the emulator surface to page 23:
`SURFACE emulator PAGE-SET 23`

Press page 1 row 2 column 3:
`LOCATION 1/2/3 PRESS`

Change custom variable "cue" to value "intro":
`CUSTOM-VARIABLE cue SET-VALUE intro`

## Deprecated Commands​

These commands will be removed in a future release of Companion. There is equivalent functionality in the list above.

The following commands are deprecated and have replacements listed above. Support for this must be enabled in the settings for it to work

 *Make device go to a specific page*
- `PAGE-UP <surface id>`
 *Page up on a specific device*
- `PAGE-DOWN <surface id>`
 *Page down on a specific surface*
 *Press and release a button (run both down and up actions)*
 *Press the button (run down actions)*
 *Release the button (run up actions)*
 *Change text on a button*
 *Change text color on a button (#000000)*
 *Change background color on a button (#000000)*
- `RESCAN` *Make Companion rescan for newly attached USB surfaces*