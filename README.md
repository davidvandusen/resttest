# Bench restTest

This project is an implementation of the Bench front-end [restTest](http://resttest.bench.co/front-end).

This implementation has been approached as an MVP for demonstration purposes, but the code has been written modularly
enough so that when the scope is fleshed out and choices are made about how the application will grow in the future it
will be prepared for easy refactoring or integration into a framework if necessary.

With respect to [Consideration 5](http://resttest.bench.co/front-end#additional), the complexity of the solution making 
sense for the problems I'm solving, there seems to be no need for a framework, module bundler, or CSS preprocessor in 
this project. With more information about the scope of the project, the backlog of other features that have been 
planned, and the intent of the company to maintain this project, additional dependencies may be considered. But as it 
is, static assets seem ideal.

## Running the program

### 1. Install dependencies

Ensure that Node.js 8 or later and NPM 5 or later are installed on your system. Then, from the project root directory
run the following command and ensure it completes without errors. This will also copy client dependencies from the
**node_modules** directory to the **public/vendor** directory.

```bash
npm install
```

### 2. Run the HTTP server

A simple web server has been included as a dependency so that the site can be browsed to using the HTTP URI scheme 
rather than the file URI scheme. To start this server, run the following command.

```bash
npm start
```

### 3. Browse to the site

With the web server running, browse to <http://localhost:8080/> or run the following command from a separate terminal.

```bash
open http://locahost:8080
```

The website should appear in your default browser.

## Target environment

This program is targeted to run in current versions of major browsers (Chrome, Firefox, Edge, Safari, Opera) including
mobile versions. It should work in recent versions of Internet Explorer, although the program is not specifically 
targeted at it.

The locale that this application targets is "en-US". Some effort has been taken to prepare the application for 
localization if that is desired in the future, such as using a configurable template engine and date formatting library.

## Stack

### Technologies and versions

- Node.js 8 and NPM 5
    - Targeting the latest stable version of Node.js and using NPM 5 to take advantage of package locks.
- ECMAScript 5.1 
    - If the project called for it, ECMAScript 6 or later features could be used and then transpiled (using Babel, for 
      example.) Those features are unnecessary for this small project.
    - The Fetch API will be used to access the required JSON resources. No local proxy will be necessary because the 
      responses from the API include CORS headers that allow all origins, so the Same-Origin Policy need not be worked 
      around.
- CSS
    - A mobile-first approach is used, so media queries are utilized only when styles for larger screens differ from
      mobile screens using typical break points.
- HTML 5.1
    - Where applicable I will use the latest HTML semantic elements. However, no shim to enable the styling of these 
      elements in old versions of Internet Explorer will be included.

### Dependencies

- Moment.js
    - Date parsing and formatting are error prone to write, and tedious to maintain. Moment.js is the de facto standard
      library for these tasks in JavaScript.
- Handlebars.js
    - Enough HTML templating is required for this project that a dependency on a minimal template engine seems 
      reasonable. Handlebars handles simple but necessary tasks such as compiling templates and escaping user values.
- http-server
    - Rather than browsing the project using the file URI scheme, a simple web server running on Node.js can serve the
      files in the **public** directory so that they may be accessed using the HTTP URI scheme.
