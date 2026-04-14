# HTTP Remote Control | Bitfocus Companion

Remote triggering can be done by sending `HTTP` Requests to the same IP and port Companion is running on.

## Commands​

This API tries to follow REST principles, and the convention that a `POST` request will modify a value, and a `GET` request will retrieve values.

- Press and release a button (run both down and up actions)
 Method: POST

- Press the button (run down actions and hold)
 Method: POST

- Release the button (run up actions)
 Method: POST

- Trigger a left rotation of the button/encoder Method: POST

- Trigger a right rotation of the button/encoder Method: POST

- Set the current step of a button/encoder Method: POST

- Change background color of button Method: POST

- Change text color of button Method: POST

- Change text of button Method: POST

- Change text of button Method: POST
 Body: `{ "text": "<text>" }`

- Change custom variable value
 Method: POST

- Change custom variable value
 Method: POST
 Path: `/api/custom-variable/<name>/value`
 Body: `<value>`

- Get custom variable value
 Method: GET
 Path: `/api/custom-variable/<name>/value`

- Get Module variable value
 Method: GET

- Rescan for USB surfaces
 Method: POST
 Path: `/api/surfaces/rescan`

## Examples​

Press page 1 row 0 column 2:
POST `/api/location/1/0/2/press`

Change the text of row 0 column 4 on page 2 to TEST:
POST `/api/location/1/0/4/style?text=TEST`

Change the text of row 1, column 4 on page 2 to TEST, background color to #ffffff, text color to #000000 and font size to 28px:
POST `/api/location/2/1/4/style`
Body: `{ "text": "TEST", "bgcolor": "#ffffff", "color": "#000000", "size": 28 }`

Change custom variable "cue" to value "intro" by URL:
POST `/api/custom-variable/cue/value?value=intro`

Change custom variable "cue" to value "Some text" by body:
POST `/api/custom-variable/cue/value`
Content-Type `text/plain`
Body: `Some text`

Change custom variable "cue" to value "Some text" by body using JSON:
POST `/api/custom-variable/cue/value`
Content-Type `application/json`
Body: `"Some text"` - Text needs to be enclosed in double quotes, quotes in the text need to be escaped with a backslash.

Change custom variable "data" to a JSON object: POST `/api/custom-variable/data/value`
Content-Type `application/json`
Body: `{"name":"Douglas", "answer":42}` - Body needs to be a valid JSON.
The object will be stored in the variable value and will not be converted to a string. You can also use the data types boolean, number, array or null. JSON does not support sending undefined as a value, but we interpret an empty body as undefined, properties of an object can of course be undefined.

## Deprecated Commands​

warning

These commands will be removed in a future release of Companion. There is equivalent functionality in the list above.

The following commands are deprecated and have replacements listed above. Support for this must be enabled in the settings for it to work

 *Press and release a button (run both down and up actions)*
 Press a button (run both down actions)\_
 Release a button (run up actions)\_
 *Change background color of button*
 *Change color of text on button*
 *Change text on a button*
 *Change text size on a button (between the predefined values)*
 *Change custom variable value*
- `/rescan`
 *Make Companion rescan for newly attached USB surfaces*