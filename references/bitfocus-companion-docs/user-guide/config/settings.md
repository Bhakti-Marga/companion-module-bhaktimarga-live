# Settings | Bitfocus Companion

In the Settings tab, you can configure Companion settings.

## General​

The **Installation Name** is used to define the name this installation of Companion will display in the browser titles. This can be useful in networks containing multiple Companion control devices to differentiate between them in different browser tabs.

## Buttons​

- **Flip counting direction up/down**
 When unchecked, pressing the **Page Up** button will increase to the next page (from page 2 to page 3). When checked, it will decrease to the previous page (from page 2 to page 1).

- **Show + and - instead of arrows on page buttons**
 Changes the page buttons from the standard arrows symbols to + and - symbols instead.

- **Show the topbar on each button**
 Disable this to hid the Yellow bar and the button number at the top of each button.

## Surfaces​

More details on supported surfaces are available in the chapter on [Surfaces](http://127.0.0.1:8000/user-guide/surfaces/).

- **Watch for new USB Devices** Companion can watch for newly connected USB Surfaces if this is enabled. If disabled, you will have to trigger a refresh yourself for Companion to use newly connected Stream Decks.

- **Watch for Discoverable Remote Surfaces** Companion can scan the network for network-connected Stream Decks and Companion Satellite installations.

- **Enable direct connection to Stream Decks** Whether to enable support for connecting to Stream Deck devices directly (not using the Elgato software) When this is disabled, the Elgato software can be used

- **Enable connected X-keys** Whether to enable support for connecting to XKeys devices.

- **Use old layout for X-keys** Whether to use the old layout for XKeys devices. This uses a compact layout that allows the surfaces to fit on multiple 8x4 pages.
 We recommend disabling this, it will be removed in a future version of Companion.

- **Enable connected Loupedeck and Razer Stream Controller devices** Whether to enable support for connecting Loupedeck and Razer Stream Controller devices.

- **Enable connected Contour Shuttle** Whether to enable support for connecting to Contour Shuttle devices.

- **Enable connected Blackmagic Atem Micro Panel and Resolve Replay Editor** Whether to enable support for connecting to Blackmagic Atem Micro Panel and Resolve Replay Editor devices. When this is enabled you must not have the Atem software open, as it will conflict.

- **Enable connected VEC Footpedal** Whether to enable support for connecting to VEC Footpedal devices.

- **Enable connected 203 Systems Mystrix** Whether to enable support for connecting to 203 Systems Mystrix

### PIN lockout​

- **Enable Pin Codes**
 Allows surfaces to be locked out after a timeout and require a PIN to unlock.

- **Link Lockouts**
 Locks out all surfaces when one is locked out.

- **Pin Code**
 The PIN that needs to be entered to unlock the surface.

- **Pin Timeout (seconds, 0 to turn off)**
 The number of seconds of inactivity before a surface locks. Enter `0` if you don't want it to lock out due to inactivity (instead, add an action to a button to trigger a lockout on demand).

## Protocols​

### Satellite​

- **Satellite Listen Port**
 The port to listens for satellite clients on.

### TCP​

*If enabled, Companion will listen for TCP messages, allowing for external devices to control Companion.*

- **TCP Listener**
 Check to allow Companion to be controlled over TCP.

- **TCP Listen Port**
 The port to listens to commands on.

### UDP​

*If enabled, Companion will listen for UDP messages, allowing for external devices to control Companion.*

- **UDP Listener**
 Check to allow Companion to be controlled over UDP.

- **UDP Listen Port**
 The port to listens to commands on.

### OSC​

*If enabled, Companion will listen for OSC messages, allowing for external devices to control Companion.*

- **OSC Listener**
 Check to allow Companion to be controlled over OSC.

- **OSC Listen Port**
 The port to listens to commands on.

### RossTalk​

*If enabled, Companion will listen for RossTalk messages, allowing for external devices to control Companion.*

- **RossTalk Listener**
 Check to allow Companion to be controlled over RossTalk.

- **RossTalk Listen Port**
 The port to listens for RossTalk clients on.

### Ember+​

*If enabled, Companion will listen for Ember+ messages, allowing for external devices to control Companion.*

- **Ember+ Listener**
 Check to allow Companion to be controlled over Ember+.

- **Ember+ Listen Port**
 The port to listens for Ember+ connections on.

### Artnet Listener​

*If enabled, Companion will listen for Artnet messages, allowing for external devices to control Companion. An example GrandMA2 fixture file for controlling Companion can be found on the bottom of that tab.*

- **Artnet Listener**
 Check to allow Companion to be controlled over Artnet.

- **Artnet Universe (first is 0)**
 The Artnet universe Companion will listen on.

- **Artnet Channel**
 The starting channel on the universe Companion listens to.

## Backups​

Companion can back itself up on a schedule to multiple directories if desired. These backups can be synced to cloud storage or backed up during OS backup to give more piece-of-mind to administrators.

Companion has four different types of backups: Raw Database, Compressed, JSON, and YAML. Raw Database backups are the most complete yet can't be restored using Companion's UI. Compressed, JSON, and YAML backup types can be restored using Companion's UI (see the Restoring section below).

Compressed backups are recommended for most users.

### Setting Up Backups​

1. Click on **Add Backup Rule** to create a new backup entry
2. Fill out the right pane:
 - Rule Name - The name of your backup schedule.
 - Cron Schedule - Use cron syntax to indicate your backup schedule. You can use [crontab guru](https://crontab.guru/) to help you generate the correct syntax.
 - Backup Type - Select a backup type. Compressed backups are recommended for most users.
 - Backup Path - Fill out where backups are stored, including your root directory (Linux, Mac OS) or drive letter (Windows). If left blank, Companion will default to its built-in location.
 - Backup Name Pattern - Using Companion variables, fill out the name of each backup.
 - Number of Backups to Keep - Companion will delete older backups after this number of backups has been reached.
3. Click the yellow **Run Now** button to test your backup rule.

### Restoring​

Compressed, JSON, and YAML backups can be restored using the [Import/Export](http://127.0.0.1:8000/user-guide/config/import-export) page. Click Import Configuration and select the backup file.

Raw database backups *cannot* be imported using Companion's UI.

A list of previous backups can be found at the bottom of the **Edit Backup Rule** pane after clicking the backup rule. Backups can be deleted using Companion's UI.

## Advanced​

### Admin UI Password​

*If enabled, Companion will require a password to view any of the configuration pages. This does not make an installation secure, it is only designed to stop casual browsers*

- **Enable Locking** Whether to enable the admin password and lockout feature

- **Session Timeout (minutes, 0 for no timeout)** How long after being idle should the ui lock itself. If set to 0 then it does not automatically lock

- **Password** The password that must be entered to unlock the ui

### HTTPS Web Server​

*An HTTPS server can be enabled for the Companion web interfaces should your deployment require it. It is never recommended to expose the Companion interface to the Internet and HTTPS does not provide any additional security for that configuration.*

- **HTTPS Web Server**
 Check to enable the HTTPS web server.

- **HTTPS Port**
 The port number HTTPS is served on.

- **Certificate Type**
 Select from "Self Signed" to use the native certificate generator or "External" to link to certificate files on the file system.

 **Common Name (Domain Name)** Enter the "Common Name" (typically a domain name or hostname) that the self signed certificate should be issued for.

 **Certificate Expiry Day** Select the number of days the self signed certificate should be issued for (365 days is the default)

 **Private Key File (full path)** The full file path for an external private key file.

 **Certificate File (full path)** The full file path for an external certificate file.

 **Chain File (full path)** Option field to provide the full file path for an external chain file.