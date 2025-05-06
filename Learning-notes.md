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

## Build the new issue page

### Create an issue page

Create a /app/issues/new folder and page.tsx file. Use Text Field and Text Area to get user input. Since we are dealing with user input and submit, we need to make it a client side component. Also add a link at issues/page.tsx to direct user here.

### Customize Radix theme

In root layout, temporarily add a ThemePanel element, configure the theme and copy final result. Then replace Theme element in layout with customized theme.

The font family is overridden by Radix UI. To make Inter font or other custome font works, we need to create a variable name for the font, and follow the [instructions](https://www.radix-ui.com/themes/docs/theme/typography#with-nextfont). However, Radix UI still has some bugs and we can add "!important" in our customed css file to force Inter font.

!important make one style override any other rule, even if it's more specific or comes later. Use it sparingly.

### Add a markdown editor

Introduce a library called SimpleMDE. Install it and replace TextArea with SimpleMDE.

We need to dynamically import SimpleMDE because the underlying `codemirror` it depends on relies on `document` to render editors, but the `document` object is part of the browser environment and does not exist on server.

### Handle form submission

Introduce a library called React Hook Form (RHF). Use useForm hook to create a React hook form object and destruct it. Three methods are used: register, handleSubmit, control.

1. register: link input element with the RHF object. Using register makes the element **uncontrolled** component, so we don't have `value` attribute. That's why we need a Controller to wrap SimpleMDE

If we inspect `register('title')`, we find it has following attributes:

```
{
  name: "title",
  onChange: ƒ,
  onBlur: ƒ,
  ref: ƒ,
}
```

2. handleSubmit: define submit event
3. control: necessary for Controller element

**SimpleMDE element**

Many 3rd-party components like SimpleMDE are internally designed to be controlled, meaning:

1. They expect a **value** prop (current text).

2. They expect an **onChange** handler to update that text.

So if we don’t provide those props, it might still render, but:

1. We won't be able to sync the content with React Hook Form.

2. React has no idea what the value is.

3. On submission, description is undefined.

**Controlled and uncontrolled components in React**

Controlled components use state to manage form data. Uncontrolled components use ref to manage form data.

Controlled components can validate input in real time. Uncontrolled components can validate input when submitting the form.

Controlled components expect `value` and `onChange` props to manage its state.

[Reference](https://medium.com/@agamkakkar/controlled-v-s-uncontrolled-component-in-react-2db23c6dc32e#:~:text=In%20a%20controlled%20component%2C%20React,what%20to%20insert%20and%20where.)

**Controller element**

Controller is a component from React Hook Form that acts as a bridge between controlled components and the form state. We use three attributes here:

1. name: Name of the rendered component. This attribute is passed to field.name attribute.

2. control: An object returned by useForm() that manages form state internally. We must pass it to `<Controller />` so it can interact with the form.

3. render: A function that tells Controller how to render the actual input.

`({ field }) => (...)`: This syntax is object destructuring — it extracts the field object from the argument. `field` contains:

```
{
  name: "description",
  value: "...",
  onChange: ƒ,
  onBlur: ƒ,
  ref: ƒ,
}
```

### Handle Errors

Create an error state and set it to the error message we receive. Use Callout element in Radix UI to display this error message.

### Implement client-side validation

Use zodResolver to check user input validity. Specify it in useForm.

Add a formState and destruct it to use errors object. Use errors.title and errors.description to show the message.

If we submit an empty form, SimpleMDE regards it as undefined by default. We need to add `.default('')` in schema to ensure the description field is always a string, even if empty. In this way, the customized message in schema will be shown.

### Create customized ErrorMessage component

Create a customized ErrorMessage component, so we don't have to use `Text` component and define its attribute twice. Use PropsWithChildren to simplify code.

### Add a spinner in button

Refer to this [website](https://tw-elements.com/docs/standard/components/spinners/). Copy the code, create a new component and modify spinner's size and border.

## Show the issues

### Create a responsive issues table

Use Table in Radix UI to create a table of three columns: issue title, status and create time.

Use Tailwind to hide latter two columns in small screen. Here we use `hidden md:table-cell` not `hidden md:visible`.

Because in Tailwind, `hidden` means `display:none` in CSS. It fully removes the element. `visible` only affects elements with `visibility:hidden`, not `display:none`.

### Build issue status badge

Create a new component using Radix UI Badge component.

Use a map to store the relationship between Status and name and color. This map is created outside of the component so we won't create this map each time we render a component.

The color attribute is set to a series of strings, so we need to specify its available values in the definition rather than set its type to string.

### Add loading skeleton

Install delay library. Create a loading.tsx besides page.tsx. Next.js will show this loading page when loading. Use delay to force a 2 seconds delay.

Install a react-loading-skeleton library. Copy the import from its document. Use Skeleton when we need to render data.

Separate 'New Issue' button as a component and add it to both the page.tsx and loading.tsx file to make sure the layout doesn't change much.

### Show issue details

Create an [id] folder and a loading.tsx and page.tsx in it.

In page.tsx, we get the input id and use prisma to find the issue. A `notFound()` function is used when the id is invalid, and we don't need to add `return` in front of it. For now, we only show the details in paragraph.

In loading.tsx, we add some text to indicate loading status.
