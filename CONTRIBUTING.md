This file contains instructions for developers.

Note that this application is based on our [cookiecutter webapp deluxe template](https://github.com/UUDigitalHumanitieslab/cookiecutter-webapp-deluxe); the instructions below come from the general repository.

However, unlike most of our applications, digital ATLAS works without a backend or database: all necessary data is included in the frontend. The Django backend is still included because that allows the application to run in our normal deployment configuration. Keep this in mind when consulting the documentation below.

## Before you start

You need to install the following software:

 - Python >= 3.8, <= 3.10
 - virtualenv
 - [Visual C++ for Python][1] (Windows only)
 - Node.js >= 8
 - Yarn
 - [WebDriver][2] for at least one browser (only for functional testing)
 - WSGI-compatible webserver (deployment only)
 - PostgreSQL >= 10, client, server and C libraries (not used yet)


[1]: https://wiki.python.org/moin/WindowsCompilers
[2]: https://pypi.org/project/selenium/#drivers


## How it works

This project integrates four isolated subprojects, each inside its own subdirectory with its own code, package dependencies and tests:

- **backend**: the server side web application based on [Django][3] and [DRF][4]. Within this project this only serves the Angular frontend

- **data**: reads the Excel sheet with all the collected data and exports it to a format which can be used by the frontend

 - **frontend**: the client side web application based on [Angular](https://angular.io)

 - **functional-tests**: the functional test suite based on [Selenium][6] and [pytest][7]

[3]: https://www.djangoproject.com
[4]: https://www.django-rest-framework.org
[6]: https://www.selenium.dev/documentation/webdriver/
[7]: https://docs.pytest.org/en/latest/

Each subproject is configurable from the outside. Integration is achieved using "magic configuration" which is contained inside the root directory together with this README. In this way, the subprojects can stay truly isolated from each other.

If you are reading this README, you'll likely be working with the integrated project as a whole rather than with one of the subprojects in isolation. In this case, this README should be your primary source of information on how to develop or deploy the project. However, we recommend that you also read the "How it works" section in the README of each subproject.


## Development

### Quickstart

First time after cloning this project:

```console
$ cd frontend
$ yarn
$ yarn build
```

Running the application in [development mode][8] (hit ctrl-C to stop):

```console
$ yarn start
```

This will run the frontend and watch all source files for changes. You can visit the frontend on http://localhost:4200/.


### Commands for common tasks

The `package.json` next to this README defines several shortcut commands to help streamline development. In total, there are over 30 commands. Most may be regarded as implementation details of other commands, although each command could be used directly. Below, we discuss the commands that are most likely to be useful to you. For full details, consult the `package.json`.

Install the pinned versions of all package dependencies in all subprojects:

```console
$ yarn
```

Run backend and frontend in [production mode][8]:

```console
$ yarn start-p
```

Run the functional test suite:

```console
$ yarn test-func [FUNCTIONAL TEST OPTIONS]
```

The functional test suite by default assumes that you have the application running locally in production mode (i.e., on port `4200`). See [Configuring the browsers][10] and [Configuring the base address][11] in `functional-tests/README` for options.

[10]: functional-tests/README.md#configuring-the-browsers
[11]: functional-tests/README.md#configuring-the-base-address

Run *all* tests (mostly useful for continuous integration):

```console
$ yarn test [FUNCTIONAL TEST OPTIONS]
```

Run an arbitrary command from within the root of a subproject:

```console
$ yarn back  [ARBITRARY BACKEND COMMAND HERE]
$ yarn front [ARBITRARY FRONTEND COMMAND HERE]
$ yarn func  [ARBITRARY FUNCTIONAL TESTS COMMAND HERE]
```

For example,

```console
$ yarn back less README.md
```

is equivalent to

```console
$ cd backend
$ less README.md
$ cd ..
```

Run `python manage.py` within the `backend` directory:

```console
$ yarn django [SUBCOMMAND] [OPTIONS]
```

`yarn django` is a shorthand for `yarn back python manage.py`. This command is useful for managing database migrations, among other things.

Manage the frontend package dependencies:

```console
$ yarn fyarn (add|remove|upgrade|...) (PACKAGE ...) [OPTIONS]
```



### Notes on Python package dependencies

Both the backend and the functional test suite are Python-based and package versions are pinned using [pip-tools][13] in both subprojects. For ease of development, you most likely want to use the same virtualenv for both and this is also what the `bootstrap.py` assumes.

[13]: https://pypi.org/project/pip-tools/

This comes with a small catch: the subprojects each have their own separate `requirements.txt`. If you run `pip-sync` in one subproject, the dependencies of the other will be uninstalled. In order to avoid this, you run `pip install -r requirements.txt` instead. The `yarn` command does this correctly by default.

Another thing to be aware of, is that `pip-compile` takes the old contents of your `requirements.txt` into account when building the new version based on your `requirements.in`. You can use the following trick to keep the requirements in both projects aligned so the versions of common packages don't conflict:

```console
$ yarn back pip-compile
# append contents of backend/requirements.txt to functional-tests/requirements.txt
$ yarn func pip-compile
```


### Development mode vs production mode

The purpose of development mode is to facilitate live development, as the name implies. The purpose of production mode is to simulate deployment conditions as closely as possible, in order to check whether everything still works under such conditions. A complete overview of the differences is given below.

dimension  |  Development mode  |  Production mode
-----------|--------------------|-----------------
command  |  `yarn start`  |  `yarn start-p`
base address  |  http://localhost:8000  |  http://localhost:4200
backend server (Django)  |  in charge of everything  |  serves backend only
frontend server (angular-cli)  |  serves  |  watch and build
static files  |  served directly by Django's staticfiles app  |  collected by Django, served by gulp-connect
backend `DEBUG` setting  |  `True`  |  `False`
backend `ALLOWED_HOSTS`  |  -  |  restricted to `localhost`
frontend sourcemaps  |  yes  |  no
frontend optimization  |  no  |  yes


## Deployment

Both the backend and frontend applications have a section dedicated to deployment in their own READMEs. You should read these sections entirely before proceeding. All instructions in these sections still apply, though it is good to know that you can use the following shorthand commands from the integrated project root:

```console

# collect static files of both backend and frontend, with overridden settings
$ yarn django collectstatic --settings SETTINGS --pythonpath path/to/SETTINGS.py
```

You should build the frontend before collecting all static files.
