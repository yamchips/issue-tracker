# Overview

This is my study record of building an issue tracker.

## Build the navbar

Create a NavBar.tsx in app folder. Add this component to layout.tsx so it appears in every route.

Use an array to store all options in the navbar, so the style code doesn't repeat.

### Style the active link

Change NavBar into client side component because we are dealing with click event in browser. Use usePathname hook to get the current path.

Method 1: Use backtick to wrap the class names and check whether href equals current path. When class names get complex, it's hard to tell which value we choose.

Method 2: Use classnames package. Define class names conditionally. Better readability. Similar packages are clsx and [twMerge](https://www.linkedin.com/pulse/understanding-differences-between-clsx-classnames-react-terranova-l5dxf/).
