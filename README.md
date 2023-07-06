# Gmail Unread Messages Checker

This script allows you to check the number of unread messages in your Gmail account using Playwright and Puppeteer.

## Prerequisites

Before running the script, ensure that you have the following prerequisites:

- Node.js installed on your machine
- A Gmail account (without two-factor authentication enabled)

## Installation

1. Clone the repository or download the script to your local machine.

2. Open a terminal and navigate to the directory containing the script.

3. Install the required dependencies by running the following command:

   yarn install

## Usage

Open a terminal and navigate to the directory containing the script. Use the following command to run the script:

node main.js --email your.email@gmail.com --password yourPassword123 [--chromeExecutablePath /path/to/chrome/executable]

Replace the placeholders with your own values:

- your.email@gmail.com: Your Gmail address.
- yourPassword123: Your Gmail password.
- /path/to/chrome/executable (optional): Path to a custom Chrome executable. Include this option if you want to use a specific Chrome installation.

Example:

node main.js --email john.doe@gmail.com --password myPassword123 --chromeExecutablePath /usr/bin/chromium-browser

The script will launch a Chromium browser, log in to your Gmail account, and start counting the number of unread messages. The progress will be displayed in a progress bar.

Once the script completes, it will output the total number of unread messages.

To ensure proper functionality and prevent detection by anti-bot mechanisms, this script is designed to run the browser in head mode. However, if you prefer not to see the browser window while the script is running, you can utilize the following command (Xvfb installation is required):

xvfb-run --auto-servernum --server-num=1 node main.js --email your.email@gmail.com --password yourPassword123 [--chromeExecutablePath /path/to/chrome/executable]

## Notes

- The script uses the Playwright libraries to automate browser actions. It emulates user behavior to log in to Gmail and count unread messages.
- The puppeteer-extra-plugin-stealth package is used to enhance stealth capabilities and avoid detection by anti-bot mechanisms.
- The cli-progress package is used to display a progress bar during the execution of the script.
- The args package is used to parse command-line arguments and options.

## Docker run

If your OS official not supported by playwright (like ubuntu 22.10, 23.04) to avoid installation OS browser dependency issue you can run script from docker

build container: docker build -t playwright-test . --build-arg EMAIL=YOUR_EMAIL --build-arg PASSWORD=YOUR_PASSWORD 
start container: docker run playwright-test

to view script output with work result run this way
- build container with command docker build -t playwright-test . --build-arg EMAIL=YOUR_EMAIL --build-arg PASSWORD=YOUR_PASSWORD 
- start container: docker run playwright-test
- view container id by docker ps
- docker exec -it YOUR_CONTAINER_ID bash
- use same command as for local run without browser window open (xvfb-run --auto-servernum --server-num=1 node script.js --email your.email@gmail.com --password yourPassword123) you can view this command description above in Usage section