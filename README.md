# First Contributions

This project aims to encourge self-learning and guide the DAIICT students to make their contribution, follow the steps below.

_If you're not comfortable with command line, [here are tutorials using GUI tools.](#tutorials-using-other-tools)_


#### If you don't have git on your machine, [install it](https://docs.github.com/en/get-started/quickstart/set-up-git).

## Fork this repository

Fork this repository by clicking on the fork button on the top of this page.
This will create a copy of this repository in your account.

<img align="center" width="600" src="https://github.com/user-attachments/assets/8fa0f804-8773-4105-89d5-c087b4157ff1" alt="fork this repository" />

## Clone the repository

<img align="right" width="300" src="https://firstcontributions.github.io/assets/Readme/clone.png" alt="clone this repository" />

Now clone the forked repository to your machine. Go to your GitHub account, open the forked repository, click on the code button and then click the _copy to clipboard_ icon.

Open a terminal and run the following git command:

```bash
git clone "url you just copied"
```

where "url you just copied" (without the quotation marks) is the url to this repository (your fork of this project). See the previous steps to obtain the url.

<img align="right" width="300" src="https://firstcontributions.github.io/assets/Readme/copy-to-clipboard.png" alt="copy URL to clipboard" />

For example:

```bash
git clone https://github.com/this-is-you/Inkling-GSOC2025-contributions.git
```

where `this-is-you` is your GitHub username. Here you're copying the contents of the first-contributions repository on GitHub to your computer.

## Create a branch

Change to the repository directory on your computer (if you are not already there):

```bash
cd Inkling-GSOC2025-contributions
```

Now create a branch using the `git switch` command:

```bash
git switch -c your-new-branch-name
```
**Add new branch name as your DAIICT ID: 202XXXXXX**

For example:

```bash
git switch -c 202301272
```

## Make necessary changes and commit those changes

Run `npm i` to install necessary dependencies.

Now open `frontend/src/utils/DAIICTids` folder in a text editor, add a file with name as `202XXXXXX.tsx`. Now copy paste the code from `202301272.tsx`. **Make sure to make necessary changes to your `202XXXXXX.tsx` file.**

Now open `frontend/src/pages/Daiict.tsx` file and import your component i.e `202XXXXXX.tsx` as `Daiictid202XXXXXX` and add it inside the div where you can see others id / where you can see `<Daiictid202301272/>`.

Now go to the root directory and run `npm run client` and if a error message pops up check again and redo the steps. If you can see your card without any error message create go ahead and add and commit your changes.

If you go to the project directory and execute the command `git status`, you'll see there are changes.

Add those changes to the branch you just created using the `git add` command:

```bash
git add .
```

Now commit those changes using the `git commit` command:

```bash
git commit -m "feat(202XXXXXX): added 202XXXXXX id card component."
```

## Push changes to GitHub

Push your changes using the command `git push`:

```bash
git push -u origin 202XXXXXX
```

replacing `202XXXXXX` with the name of the branch i.e. your student ID that you created earlier.

## Submit your changes for review

If you go to your repository on GitHub, you'll see a `Compare & pull request` button. Click on that button.

<img style="float: right;" src="https://firstcontributions.github.io/assets/Readme/compare-and-pull.png" alt="create a pull request" />

Now submit the pull request.
where `Add this is you` is written write this: `feat(202XXXXXX): added 202XXXXXX id card component`.

<img style="float: right;" src="https://firstcontributions.github.io/assets/Readme/submit-pull-request.png" alt="submit pull request" />

Soon we will merge all your changes into the main branch of this project.
