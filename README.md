# First Contributions

This project aims to encourge self-learning and guide the DAIICT students to make their contribution, follow the steps below.

_If you're not comfortable with command line, [here are tutorials using GUI tools.](#tutorials-using-other-tools)_

<img align="right" width="300" src="https://firstcontributions.github.io/assets/Readme/fork.png" alt="fork this repository" />

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
git switch -c 202XXXXXX
```

## Make necessary changes and commit those changes

Now open `CONTRIBUTIONS.md` file in a text editor, add your DAIICT ID and your name to it. Don't add it at the beginning or end of the file. Put it anywhere in between. Now, save the file.

<img align="right" width="450" src="https://firstcontributions.github.io/assets/Readme/git-status.png" alt="git status" />

If you go to the project directory and execute the command `git status`, you'll see there are changes.

Add those changes to the branch you just created using the `git add` command:

```bash
git add CONTRIBUTIONS.md
```

Now commit those changes using the `git commit` command:

```bash
git commit -m "contri(202XXXXXX): added 202XXXXXX to CONTRIBUTIONS.md"
```

replacing `202XXXXXX` with your DAIICT ID.

## Push changes to GitHub

Push your changes using the command `git push`:

```bash
git push -u origin 202XXXXXX
```

replacing `202XXXXXX` with your DAIICT ID.

## Submit your changes for review

If you go to your repository on GitHub, you'll see a `Compare & pull request` button. Click on that button.

<img style="float: right;" src="https://firstcontributions.github.io/assets/Readme/compare-and-pull.png" alt="create a pull request" />

Now submit the pull request.
where `Add this is you` is written write this: `contri(202XXXXXX): added 202XXXXXX to CONTRIBUTIONS.md`.

<img style="float: right;" src="https://firstcontributions.github.io/assets/Readme/submit-pull-request.png" alt="submit pull request" />

Soon we be merging all your changes into the main branch of this project.