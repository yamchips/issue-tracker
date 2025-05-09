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

### Style issue detail page

Use Radix UI's Heading, Text, Card, Flex to style this page.

### Add markdown preview

Add a new issue with some markdown styles, these styles cannot be shown in new issue page.

Introduce a new library called Tailwind typography. Install it and add `prose` to the `Card` component so the style of markdown is shown.

### Build a styled link component

Link component can be imported from two resources:

1. next/link: supports client side navigation
2. radix/themes: supports a full page reload, is a styled version of a plain HTML `<a>` tag.

To get the client side navigation and a suitable color (because we are using Radix UI's theme), create a Link component combining these two Links.

Refer to this [page](https://nextjs.org/docs/app/api-reference/components/link#if-the-child-is-a-custom-component-that-wraps-an-a-tag).

Using above method raises an error, it leads us to this git [repo](https://github.com/vercel/next.js/commit/489e65ed98544e69b0afd7e0cfc3f9f6c2b803b7) and also asks us to run following command to install a new library.

`npx @next/codemod@latest new-link`

After that, we got a new hint saying that `legacyBehavior` will be deprecated in the future. So, we need to use RadixLink to wrap NextLink to avoid using this attribute.

1.  `asChild` tells Radix to render NextLink instead of a native `<a>`.

2.  `ComponentProps<typeof NextLink>` is a TypeScript utility that extracts all the props that the NextLink component accepts. This means:

    We don’t have to manually type out every prop like href, onClick, className, etc.

    We get full autocomplete, type safety, and future-proofing when Next.js adds new props.

3.  `const Link = ({ href, name, ...props }: Props) => { ... }`

    We're destructuring the Props object:

    We explicitly pull out href and name

    Then collect the rest of the props into a new object called props

    For example, if someone uses your Link like this:

    `<Link href="/about" name="About" className="text-blue-500" target="_blank" />`

    Then:

    `href = "/about"`

    `name = "About"`

    `props = { className: "text-blue-500", target: "\_blank" }`

### Additional loading skeletons

Use react loading skeleton in [id]/loading.tsx and new/loading.tsx.

### Organize imports

Create an index.ts file in /app/components folder and put all components' import here.

## Update issues

### Add the edit button

In [id] page, we change the div into a Grid. To get responsive design, we use `initial` and `xs` to change Grid's column from 1 to 2. Then we install Radix UI icons library and add an edit button with pencil 2 icon.

### Apply the single responsibility principle (SRP)

Create two components, IssueDetail and IssueEditButton and organize the code in [id]/page.tsx.

### Build the edit issue page

Create a '\_components' folder and IssueForm.tsx, move code in /issues/new/page.tsx into IssueForm. Modify the type name to IssueFormData and function name to IssueForm.

Create an optional props called issue for IssueForm. Set default value of title and description field.

Use IssueForm component in /issues/new/page.tsx and [id]/edit/page.tsx.

### Build an API

Create /api/issues/[id]/route.ts. Create a PATCH method and add two parameters: request and params from Props.

In the PATCH function, first we check whether the request body fits issue schema, then we get the id parameter and use it to find the issue. If we cannot find the issue, return 404; otherwise, we update the issue.

### Update the issue

In IssueForm, add an if clause to check whether we already have an issue. If so, we use post method; otherwise, post method.

Also add a function to show button text according to issue object.

### Understand caching

In Next.js, we have three types of cache (three cache layers).

1. **Data cache**

   When we use `fetch` function to get data. The data is stored in the file system. It won't reloaded unless we redeploy the app. We can use following options to revalidate or disable this behavior.

   `fetch('', {cache: 'no-store'})`

   `fetch('', {next: {revalidate: 3600}})`

2. **Full Route Cache(Cache on the server)**

   This type of cache is used to store the output of statically rendered routes.

   In Next.js, we have static and dynamic rendering. Static rendering happens when our routes are rendered statically (at build time).Dynamic rendering means our routes are rendered dynamically at request time. In Next.js, routes that **don't have a parameter** are considered static by default.

   This cache is also stored in the file system and won't reload unless we redeploy our app.

   For example, the issue page is static by default. That means if we create a new issue, it cannot be shown in this page. So, we need to make this page non-static.

   Refer to this [page](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config). We can add `export const dynamic = 'force-dynamic'` before the default export to make this page dynamic.

3. **Router Cache(Client-side Cache)**

   Store the payload of pages in browser. Lasts for a session, refreshes every time when reloading.

   The pages stored in client-side cache get automatic invalidation depending on how they are rendered. For static routes, the invalidation time is 5 minutes; for dynamic routes, 30 seconds.

   We can add a `router.refresh()` to force the page to refresh in IssueForm component.

### Improve the loading experience

When visiting app/issues/new/page.tsx, we can see a skeleton while loading. But when refresh, we see a TextField element and the SimpleMDE is loaded afterwards. That's because we dynamically load the SimpleMDE element as a client side component.

To improve the loading experience of this page, we can dynamically import the entire form. So, in IssueForm we delete the dynamic import statement and static import the SimpleMDE element. Then, in page.tsx, we dynamically import entire form. Besides, we need to set ssr to false and specify loading method to improve refresh experience. Finally, we need to set page as a client component.

In Mosh's video, he applied the same improvement to app/issues/[id]/edit/page.tsx but in the latest version his improvement doesn't work. Because:

**In Next.js 14+, `ssr: false` and dynamic import must be used in client components. Client components cannot be asynchronous.**

Edit page need to find data from database so it's asynchrounous and it must be a server component. So, we create a wrapper element to contain the form and make that element client component.

### Add a delete button and make issue detail page responsive

Add a delete button on [id] page. Use Flex to arrange the edit and delete button. To make responsive design, first we set Grid container to `columns={{ initial: "1", sm: "5" }}` and the first Box to `className="md:col-span-4"`. Here we use `sm` and `md` because `columns...` is Radix UI attribute and in Radix UI, `sm` corresponds to 768px. The `className...` is Tailwind attribute and `md` corresponds to 768px.

Then we add a Container from Radix UI in app/layout.tsx to wrap children in main, it has an attribute called size and by default it's 4. This element can create a wrapper of its children and size 4 makes them have a max width of 1136px.

## Further work

1. Update the status of an issue in edit issue page
