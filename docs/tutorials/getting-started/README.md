# Getting started

In this tutorial you will learn how to get started with Node.js development and create a project from scratch. While there are many ways of doing it, this guide is focused first on making it easy and second on using common tools.

You will need some basic tools like having a git and a code editor ([we recommend Atom](https://atom.io/)) as well as some basic knowledge around your operative system and the terminal/command line.



## Install Node.js

This will largely depend on your platform and while you can [just download the binary program from the official page](https://nodejs.org/en/) I would recommend using Node Version Manager for mac or Linux:

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
```

After this, we have to **close and open the terminal** for it to work properly. Then we use NVM to install a current Node.js' version in the terminal:

```bash
nvm install node
nvm use node
nvm alias default node
```

> Server requires **Node.js 7.6.0** or newer. **Node.js 8.9.x** LTS is recommended for long-term support from Node.js.

Great, now we should have Node.js installed and working. To test it's properly installed, execute this on the terminal:

```bash
node --version    # Should show the version number over 8.x
npm --version     # verify this is installed as well over 5.x
```



## Create your project

Now that we have Node.js installed, let's get started with one project. Create a folder in your computer and then access it from the terminal. To access it use `cd`:

```bash
cd "./projects/My Cool Project"
```

From now on, all the operations from the terminal **must** be executed while inside your project in said terminal.

Then open the project from Atom or your code editor: File > Add project folder... > My Cool Project.



## Initialize Git and npm

Git will be used for handling your code, deploying it and working collaboratively. To get your git started execute this in your terminal:

```bash
git init
```

It will create a folder called `.git` with all the version history in there. We highly recommend to create a **file** called **`.gitignore`** (yes, a point and the name with no extension) where we add at least the following:

```
*.log
npm-debug.log*
node_modules
.env
```

This is because we want these files and places to only be accessible from our computer, but we don't want to deploy them along the rest of the code.

Finally we will start our npm package by doing init in the terminal:

```bash
npm init
```

It will ask some questions, just answer them or press "enter" to accept the default (set the "main" to "index.js"). After answering everything you should have a `package.json` file, so now you can edit the part where it says "scripts" to add this:

```json
  "scripts": {
    "start": "node index.js",
    "test": "jest --coverage --forceExit"
  },
```



## Make awesome things!

That is great! Now you can install the packages that you want like server.js:

```bash
npm install server
```

And then create a file called `index.js` with the demo code to see how it works:

```js
// Import the library
const server = require('server');

// Launch the server to always answer "Hello world"
server(ctx => 'Hello world!');
```

To execute it **after saving it**, run from the terminal:

```bash
npm start
```

And finally open http://localhost:3000/ to see it in action!


> Note: this guide was published originally on [Libre University - Getting started](https://en.libre.university/lesson/V1f6Btf8g/Getting%20started) but has since been adapted better only for Node.js.
