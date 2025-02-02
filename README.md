# ChatterinoWatch

ChatterinoWatch is a simple browser extension that reports the Twitch channel you are currently watching to Chatterino. Unlike other extensions, it does not modify the Twitch UI in any way—it solely sends channel information to Chatterino for seamless integration.

## Features
- Built with Manifest V3 for better security and performance.
- Automatically detects the Twitch channel being watched.
- Sends the channel name to Chatterino.
- Lightweight and requires only essential permissions.
- Uses the original Chatterino extension key to function correctly.

## Installation
1. Download or clone this repository.
2. Open `vivaldi://extensions/` (or `chrome://extensions/` in Chromium-based browsers).
3. Enable **Developer Mode** (toggle in the top-right corner).
4. Click **Load Unpacked** and select the `ChatterinoWatch` folder.
5. Open Twitch, switch channels, and verify that Chatterino receives updates.

## Important Note About the Extension Key
Chatterino has an internal restriction that only allows extensions signed with a specific key to communicate with it. As a result, we are currently using the **key from the original Chatterino extension**. This is necessary to ensure the extension functions correctly.

We plan to submit a **pull request** to allow additional extension IDs to be recognized by Chatterino, including the one used by ChatterinoWatch. Until that is approved and merged, this extension must use the original key.

## Future Improvements
- Add support for Firefox.
- Submit a pull request to Chatterino to allow additional extension IDs.
- Improve compatibility with future browser updates.

## License
This project is open-source and intended to enhance Chatterino’s functionality for the Twitch community.

