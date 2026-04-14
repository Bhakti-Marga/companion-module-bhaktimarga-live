# Using the CompanionPi Image | Bitfocus Companion

The easiest way to get Companion running on a Raspberry Pi is to use the prebuilt CompanionPi image.

## Download the Image​

You can download the image from the [Bitfocus website](https://user.bitfocus.io/download).

## Choosing a MicroSD Card​

You're going to want a fast Micro SD card. One of the most popular ones currently on the market is the SanDisk Extreme PRO 32GB card ([on Amazon, here (Amazon US)](https://www.amazon.com/gp/product/B06XYHN68L)).

This isn't always going to be *the best* one to use, but it is a very good, adequately fast microSD card. Look for anything that is classified as **UHS 1 or higher** as these will have the read/write speeds you need for your Raspberry Pi to be useful instead of a slow pain in the neck.

## Flashing the Image​

Once you've got your fast microSD card in hand, you'll need a tool for flashing the image to the card. One of the most popular tools is [Raspberry Pi Imager](https://www.raspberrypi.com/software/) (Windows, Mac, and Linux). It's very easy to use, and can configure ssh while writing the image.

First Boot

On first boot, it'll take a few minutes for the Admin User Interface to be available. The OS has to resize itself to the capacity of your SD card and that takes an extra reboot.

## Accessing the Interface​

Once you've got your Raspberry Pi up and running with the CompanionPi image, you'll need to know the IP address of your Raspberry Pi. There are a few ways to do this:

- **Python script**: A custom Python script written to email you the IP address every time it boots *(requires internet connection at boot)*: [on GitHub, here](https://github.com/oliverscheer/send-email-with-device-ip-address)
- **Static IP**: Set a static IP address on your Pi *(good option if your Raspberry Pi is going to be always connected to the same equipment)*: [use this tutorial from The Pi Hut for 3.1.1 and older](https://thepihut.com/blogs/raspberry-pi-tutorials/how-to-give-your-raspberry-pi-a-static-ip-address-update) or [use this tutorial for 3.1.2 and later](https://www.abelectronics.co.uk/kb/article/31/set-a-static-ip-address-on-raspberry-pi-os-bookworm)
- **LCD display**: An attached LCD display to show your current IP address *(a little maker-y, and pretty cool)*: [example from PiMyLifeUp](https://pimylifeup.com/raspberry-pi-lcd-16x2/)

Once you know your IP address, you can access the Companion Admin User Interface on port 8000 of that IP address (i.e. `http://192.168.1.3:8000`).