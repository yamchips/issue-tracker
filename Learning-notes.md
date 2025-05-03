# Overview

This is my study record of building an issue tracker.

## Build the navbar

Create a NavBar.tsx in app folder. Add this component to layout.tsx so it appears in every route.

Use an array to store all options in the navbar, so the style code doesn't repeat.

### Style the active link

Change NavBar into client side component because we are dealing with click event in browser. Use usePathname hook to get the current path.

Method 1: Use backtick to wrap the class names and check whether href equals current path. When class names get complex, it's hard to tell which value we choose.

Method 2: Use classnames package. Define class names conditionally. Better readability. Similar packages are clsx and [twMerge](https://www.linkedin.com/pulse/understanding-differences-between-clsx-classnames-react-terranova-l5dxf/).

### Set up database and prisma

MySQL is used here. After installing and initializing prisma, we need to modify database from postgresql to mysql in schema.prisma and the database url in .env file.

### Create issue model

In schema.prisma, create an issue model and finish first migration. Then we can view the table in DataGrip.

### Build an API

Create /app/api/issues folder and add route.ts and schema.ts file. We need to install zod for checking format and add client.ts in /schema folder to guarantee only one prisma client instance is created.

### Set up Radix UI

Install Radix Theme and configure according to its [instructions](https://www.radix-ui.com/themes/docs/overview/getting-started).

### Build the new issue page

Create a /app/issues/new folder and page.tsx file. Use Text Field and Text Area to get user input. Since we are dealing with user input and submit, we need to make it a client side component. Also add a link at issues/page.tsx to direct user here.
