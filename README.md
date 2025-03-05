# ChatterinoWatch

ChatterinoWatch is a simple browser extension that reports the Twitch channel you are currently watching to [Chatterino](https://github.com/Chatterino/chatterino2). Unlike other extensions, it does not modify the Twitch UI in any way—it solely sends channel information to Chatterino for seamless integration.

## Features
- Built with Manifest V3 for better security and performance.
- Automatically detects the Twitch channel being watched.
- Sends the channel name to Chatterino.
- Lightweight and requires only essential permissions.
- Uses the original Chatterino extension key to function correctly.

## Installation
1. Open Chatterino and navigate to **Settings**.
2. Go to the **Browser Integration** category.
3. In "Additional extension IDs", add the following ID:
    ```
    pnpdojeoploiomepdhikamokjmapkimh
    ```
4. Click **Ok** and enjoy using ChatterinoWatch!
![image](https://github.com/user-attachments/assets/f5c02a0c-b4f2-4740-a117-cdd6c0dc10c3)



## Important Note About the Extension Key
Chatterino has an internal restriction that only allows extensions signed with a specific key to communicate with it. As a result, we are currently using the **key from the original Chatterino extension**. This is necessary to ensure the extension functions correctly.

We plan to submit a **pull request** to allow additional extension IDs to be recognized by Chatterino, including the one used by ChatterinoWatch. Until that is approved and merged, this extension must use the original key.

## Future Improvements
- Add support for Firefox.
- Submit a pull request to Chatterino to allow additional extension IDs.
- Improve compatibility with future browser updates.

## License
This project is open-source and intended to enhance Chatterino’s functionality for the Twitch community.

