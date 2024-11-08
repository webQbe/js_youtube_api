# JavaScript - YouTube API Project with Authentication

- Using YouTube Data API & OAuth2 Login 
- Log in user to YouTube account
- Enter any channel name to get data     
- Error messages
- Display channel data
    - Channel Title
    - Channel ID
    - Subscriber count
    - View count
    - Total video count
    - Channel description
    - Visit channel button
    - Latest videos with thumbnails

- Pure JavaScript & Materialize CSS used



## Get YouTube Data API Key

1. Go to Google Cloud Console: `https://console.cloud.google.com/`
2. Create New Project 
3. Go to `API & Services `> `Enable API's & Services`
4. Search for 'youtube data api v3' 
5. Select `YouTube Data API v3`  > `Enable` > `Create Credentials`
6. In  `Credential Type` > `Public data` > `Next` 
7. Get your API Key > `Done`


## Configure OAuth consent screen

1. User Type: `External` > `Create`
2. App information > Add app `Name` & `Email`
3. Add Application home page URL
4. Add developer email address > `Save` & `Continue`
5. `Scopes` > Save & Continue
6. Test users > Save & Continue


## Create an OAuth Client ID

1. Credentials > Create Credentials > OAuth client ID
2. Create OAuth client ID > Web Application > Create
3. Get Client ID


## Prepare Your App for Heroku Deployment

1. Create `package.json` file : `npm init -y`
2. In your package.json, add a start script: 

    `"scripts": {`
                    `"start": "serve -s ."`
                `}`

3. Add express to `package.json`: 
    - Run `yarn add express`
    - Ensure express appears under the `"dependencies"` section in your `package.json`. 

        `"dependencies": {`
                            `"express": "^4.17.1"`
                        `}`
    - Delete the `package-lock.json` file.

4. Create a `Procfile` and add this content : 
    `web: node main.js`

5. Install the Heroku CLI : 
    - Run : `sudo snap install --classic heroku`
    - Verify Installation: `heroku --version`

6. Log in to your Heroku account: `heroku login`

7. Create a Heroku App: `heroku create`

8. Keep your API key secure:
    - Create a `.env` file : `API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXX`
    - Add `.env` to `.gitignore` file so that Git ignores it.
    - Set your API key as an environment variable in Heroku:
        `heroku config:set API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXX`
    - Add dotenv to your dependencies: 
        - Run `yarn add dotenv`
        - If it’s already in devDependencies, move it to dependencies manually in package.json:
        `"dependencies": {`
                            `"dotenv": "^10.0.0",`
                            `"express": "^4.17.1"`
                        `}`                       

9. Deploy to Heroku: 
    - Remove `node_modules/` from `.gitignore` file
    - `git add .`
    - `git commit -m "Initial commit for Heroku deployment"`
    - `git push heroku master`

10. Add app's URL to the Authorized JavaScript origins list in Google Cloud Console.

    1. Go to the `Google Cloud Console` > `APIs & Services` > `Credentials`
    2. Find your `OAuth Client ID` > Click `Edit` (the pencil icon)
    3. Under `Authorized JavaScript origins`, add your Heroku app's URL:
        `https://young-peak-xxxxxxxxxxx-xxxxxxxxxx.herokuapp.com`
    4. Save Changes


## Troubleshooting

- If you encounter any issues, 
    - You can check the logs by running: `heroku logs --tail`
    - Clear Build Cache and push again: `heroku repo:reset -a your-app-name`
    - Make sure you're pushing to the correct Heroku remote. 
        To verify, list your remotes: `git remote -v`
    - Ensure you're on the branch you want to deploy, typically `master` or `main`



- If Heroku requires you to pull before pushing, 

It means your local branch and the remote branch on Heroku are out of sync. If you want to avoid ending up with unwanted pending commits every time, you have two main options:

1. ### Force Push: 
- If you’re confident that your local changes should overwrite what’s currently on Heroku, you can force push.
- This approach is generally safe for a solo project but should be used cautiously if you’re collaborating, as it will overwrite the Heroku branch history.

    `git push heroku master --force`

2. ### Rebase onto Heroku’s Branch
- If you prefer a cleaner approach that integrates Heroku’s commits with yours and avoids extra merge commits, use rebase. 

- Rebasing places your commits on top of the Heroku branch, so no unwanted commits are created.

    1. Fetch Heroku's latest commits: `git fetch heroku`
    2. Rebase your local changes onto Heroku's master branch: `git rebase heroku/master`
    3. Resolve any conflicts: 
            `git add <file_with_conflict>`
            `git rebase --continue`
    4. Push your changes: `git push heroku master`






 







