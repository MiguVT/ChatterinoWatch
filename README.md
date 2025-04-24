# ChatterinoWatch

**ChatterinoWatch** is a simple browser extension that reports the Twitch channel you're currently watching to [Chatterino](https://github.com/Chatterino/chatterino2).  
Unlike other extensions, it doesn’t modify the Twitch UI in any way — it only sends channel information for seamless integration.

*And yes, apparently Linus helped... or Git thinks he did.*

## Features

- Built with Manifest V3 for improved security and performance.  
- Automatically detects the Twitch channel being watched.  
- Sends the channel name to Chatterino in real time.  
- Lightweight and uses only essential permissions.  
- Fully compatible with Chatterino’s extension key system —  
  *We contributed an update to Chatterino to allow support for multiple extension IDs, enabling the development of custom browser extensions like this one.*

## Installation

1. Open **Chatterino** and navigate to **Settings**.
2. Go to the **Browser Integration** category.
3. Under “Additional extension IDs,” add the following ID:

    ```txt
    pnpdojeoploiomepdhikamokjmapkimh
    ```

4. Click **OK** and you're all set!

    ![steps-integration](https://github.com/user-attachments/assets/f5c02a0c-b4f2-4740-a117-cdd6c0dc10c3)

## Future Improvements

- Add support for Firefox.
- ~~Submit a pull request to Chatterino to allow additional extension IDs.~~ ✅ Done!
- ~~Improve compatibility with future browser updates.~~  
  ✅ Currently compatible with all Chromium-based browsers using Manifest V3. Updates will be released as needed.

## License

This project is open-source and aims to enhance Chatterino’s functionality for the Twitch community.
