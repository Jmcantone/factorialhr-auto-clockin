# Factorial HR Auto Clock-In

This repository contains a Node.js script that automates the process of clocking in hours on the Factorial HR platform.

## Features

- Asks the user how many months in the past to start.
- Asks the user for the _factorial_session_v2 COOKIE.
- Asks the user for the start time.
- Asks the user for the end time.

## Prerequisites

- Node.js (v14 or later recommended)
- npm

## Installation

1. Clone the repository:

git clone https://github.com/yourusername/factorialhr-auto-clockin.git

cd factorialhr-auto-clockin

2. Install the dependencies:

npm install

3. Generate the .exe file (optional):

npx pkg -t node14-win-x64 .


## Usage

1. Run the script:

npm start

or if you generated the .exe file:

./factorialhr-auto-clockin.exe

2. Follow the prompts to provide the required information.

3. The script will automate the clock-in process for the specified time range.

## Disclaimer

Please use this script responsibly and in compliance with your company's policies and guidelines. The creators and maintainers of this script are not responsible for any misuse or consequences resulting from its use.