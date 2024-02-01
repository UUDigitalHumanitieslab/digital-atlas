# Digital Atlas

[![Actions Status](https://github.com/UUDigitalHumanitieslab/digital-atlas/workflows/Unit%20tests/badge.svg)](https://github.com/UUDigitalHumanitieslab/digital-atlas/actions)

The [Digital ATLAS of postcolonial Europe](https://atlast.hum.uu.nl) visualizes the sites, archives, galleries, museums, monuments, organizations and events, collecting information on postcolonial intellectuals and the main migrant organizations/manifestations in Europe.

Presented at [Postcolonial Publics: Art and Citizen Media in Europe, Ca' Foscari University of Venice, VIU (May 26th, 2022)](https://www.unive.it/data/33113/1/60248).

## Contents

The repository consist of three modules:
- `backend`: a [Django](https://www.djangoproject.com/) backend that is included so the application can be run in our normal deployment environment. It's not actively used.
- `data`: [python](https://python.org) scripts to convert excel data provided by researchers into JSON format.
- `frontend`: the web interface, implemented as an [Angular](https://angular.io/) application

See [CONTRIBUTING](/CONTRIBUTING.md) for details on the setup of the application and common actions when working on the source code.

## Usage

Digital ATLAS is a web application. You can view the deployed version as [atlast.hum.uu.nl](https://atlas.hum.uu.nl).

## Licence

This repository is shared under a [BSD 3-Clause licence](/LICENSE).
