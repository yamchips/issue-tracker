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

### Add a confirmation dialog box

Refer to this [page](https://www.radix-ui.com/themes/docs/components/alert-dialog) and add a AlertDialog to wrap the button.

## Build an API to delete

In app/api/issues/[id]/route.ts file, add a DELETE function. We need to include `request:NextRequest` here because if we totally delete it, Next.js might cache the response.

Example: We delete an issue with id = 10, it succeeds. Then we delete it again, it should return not found. But since the response is cached, we get a 200 OK response.

### Implement deleting issue on the button

Go to IssueDeleteButton, in the AlertDialog's delete button, add an onclick event to delete the issue by id.

### Handle deletion error

In the delete function, add a try-catch block to deal with error. Create a state in this page and when the state is true, open a new AlertDialog which shows some message. Remember to **reset** the state to false when clicking the button.

### Add spinner when deleting

In delete button, create a state to manage deletion. Add a spinner to indicate the deletion is in progress.

### Optimize file structure

In the IssueToolBar, we have a New Issue button. Now when clicking the button, the loading file in the same folder with page.tsx file works and it shows the skeleton of this page. When we are redirected to /issues/new page, the loading file in /issues/new also works and show another skeleton.

To avoid seeing these two skeletons, we adjust the page that shows all issues to a new folder called issues/list. We also adjust the /issues/[id]/edit folder to /issues/edit and create /issues/edit/[id] and put files in /issues/edit into this new folder. We also need to adjust the links in `router.push()` and `Link`.

## Authentication

### Set up Next Auth

Refer to this [page](https://next-auth.js.org/getting-started/example#install-nextauth). Then in dot env file, set up NEXTAUTH_URL to our website name and NEXTAUTH_SECRET to a random number. Use `openssl rand -base64 32` to generate a random long string.

### Configure Google Provider

Go to Next Auth Google [page](https://next-auth.js.org/providers/google), click the configuration link and configure a credential.

Then modify /api/auth/[...nextauth]/route.ts file as suggested in the example. Add a ! mark after the variable to dismiss the error.

### Add the prisma adapter

Refer to this [page](https://authjs.dev/getting-started/adapters/prisma) but slightly change code to:

`npm i @next-auth/prisma-adpater@1.0.7`

In 2025, Next Auth is updated so we can use the suggested package, not the old version.

In [...nextauth]/route.ts, add prisma adapter as shown in the above page. Add session strategy to 'jwt'.

Then copy the user model to schema.prisma file.

Then create a migration. `npx prisma migrate dev`

If we meet an error, go to Application panel and delete the cookies from previous login.

### Add log in and log out links

Use useSession API to get status and user data. Add a Link to NavBar component. Add a Provider file and return a SessionProvider, make it client component. Wrap all elements inside it.

**Note:**

Wrapping all elements inside the provider won't make all elements client side. Only components that rely on useSession and depend on client-only logic are client components.

**Update in Next Auth v5**

In the latest version, we can use the new `auth()` function. This new function is only available on server component. [source](https://authjs.dev/getting-started/migrating-to-v5#authenticating-server-sidegi)

```
import { auth } from "@/auth"; // your configured auth file
const session = await auth();
```

### Change the layout of NavBar

Use Flex to rearrange the layout of NavBar component.

### Add a drop down menu

When a user logs in, we show a drop down menu. Here, we use DropDownMenu, Avatar component in Radix UI theme.

### Fix avatar not loading

The avatar doesn't show. Go to Network, choose Img and see the request send to the server. We can see the referrer policy is 'strict-origin-when-cross-origin'. We need to set it to 'no-referrer'.

Method 1:

In Avatar element, set the attribute `referrerPolicy="no-referrer"`. In my case it works.

Method 2:

In next.config.js file, set nextConfig to this:

```
const nextConfig = {
   async headers() {
      return [
         {
            source: "/:path*",
            headers: [
               {key: "referrer-policy", value: "no-referrer"}
            ]
         }
      ]
   }
}
```

After change the configuration file, we need to restart the server.

### Refactor NavBar component

Create two constants to refactor NavBar so it only lays out its children.

Create a global css class called 'nav-link'.

```
@layer utilities {
  .nav-link {
    @apply text-zinc-500 hover:text-zinc-800 transition-colors
  }
}
```

`@layer utilities` means we are creating a custom utility class. There are two more options: base and components. Base is for resetting styles and setting base elements like `html`, `body`. Components is for custom component classes like `.btn`, `.card`.

### Add loading skeleton to AuthStatus

Import the custom skeleton and set a width to it when the status is loading.

`if (status === "loading") return <Skeleton width="3rem" />;`

I think it's a bit wierd so I use a gray circle to replace it.

### Secure the app

Add a middleware.ts under project folder, add routes that need user log in. So, we can protect sensitive functions.

To protect endpoints, we could add the routes to middleware. But in the future if we want to expose public endpoints, they cannot be reached. Instead, we use `getServerSession` in every function we want to protect and return 401 if no session exists.

## Assign issue to user

### Build assignee dropdown button

Use Radix UI component Select. Hard code the choice for now.

### Fetch users from database

First we create a new endpoint for fetching all users. Then, we can call this endpoint in server component or client component.

Mosh's way (client fetch):

In AssigneeSelect, create a state to store users array and an effect hook to get user data asynchronously. The dependency of the effect hook is an empty array.

My way (server fetch):

In issues/[id]/page.tsx, fetch user data and add a paramter to AssigneeSelect. Pass the users array to AssigneeSelect.

In real world, for one current users, the assignees won't change often. Fetching all assignees requires considering current user's department, role and project. So, server fetch is a better option. This version of code is in branch 'server-side-fetch'

**Server-side fetching vs Client-side fetching**

| Feature Type                 | Preferred Fetching                                  |
| ---------------------------- | --------------------------------------------------- |
| Static marketing page        | Server-side                                         |
| Blog post (SEO needed)       | Server-side                                         |
| User dashboard (auth needed) | Client-side (`useQuery`)                            |
| Notifications / dropdowns    | Client-side                                         |
| Admin panel data table       | Client-side (with caching)                          |
| Product page with reviews    | Hybrid (SS fetch for product, CS fetch for reviews) |

Use server-side when SEO, fast first paint, or security is critical.

Use client-side when interactivity, personalization, or caching is key.

### Set up Tanstack Query

Install a library called tanstack/react-query. Create a QueryProvider file at app/ folder.

Create a query client instance which contains cache for storing data that we get from the backend. We should pass this using the provider to our component tree.

In the Provider, we return a QueryClientProvider element which uses React Context under the hood.

**React Context**

React Context is a built-in feature that allows you to share state or values across your component tree without having to pass props down manually at every level.

### Fetch data with Tanstack React Query

In AssigneeSelect, replace useState and useEffect with useQuery.

Params:

queryKey: an array of strings. For now we only pass a string to represent a query. If the query becomes complex, we can define it like: `queryKey: ["users", { departmentId, role: "admin" }]`.

queryFn: a function to query. Return type is data, not a Promise.

staleTime: refresh time in ms.

retry: if first query fails, retry given number of times.

### Add assigned issues to prisma schema

Modify Issue and User model in schema.prisma.

**Understand prisma schema**

@@map('accounts'): map current model to a table named 'accounts' in database

@@id([field1, field2]): a composite primary key

@@index([field]): add a database index to field to improve query performance

```
model Authenticator {
   ...
   user User @relation(fields: [userId], references: [id], onDelete: Cascade)
   ...
}
```

If a User record is deleted, all related Authenticator records will automatically be deleted as well.

In User model, there are four fields not shown in the database:

```
accounts      Account[]
sessions      Session[]
Authenticator Authenticator[]
assignedIssues Issue[]
```

They are relation fields, the inverse side of the relationships defined in the other models(Account, Session, Authenticator, Issue). They don't result in any physical columns.

### Assign an issue to user

Add onValueChange attribute to Select.Root, which requires a function. Inside the function, we use axios to send patch request to current issue to update the Issue object. This function's parameter is the value of Select.Item.

To unassign an issue, we create a new Select.Item and set its value to 'unassigned' and text to 'Unassigned'.

Here, Mosh's video is outdated. We need to:

1. Spread current issue object when sending patch request
2. Modify /api/issues/[id]/route.ts PATCH method, set `data: validation.data` for future scaling. Also, modify schema, add all possible fields and make all fields optional. Because in PATCH, we might only update part of all fields. AssignedToUserId field also can be null, so add nullable to it.
3. Set 'unassigned' as value because Radix UI doesn't allow empty string as value.

### Show toast notification

Install a library called react-hot-toast. `npm i react-hot-toast@2.4.1`. Import toast and Toaster in the AssigneeSelect component. Then we use `catch` to handle the error.

## Build the issue filter

### Create a filter component

Use Select component in Radix UI. Create a statuses array to represent the name shown in the dropdown menu and status. Modify the ToolBar component to change the layout.

### Filter issues

In IssueStatusFilter, use router to push to new url when selecting filtered category.

Use Object.values(Status) to get all Status options.

In issues/list/page.tsx, add searchParams to the component. It is a Promise now. Also check the status before sending it to prisma in case of malicious request such as '?status=OPENx'.

### Make columns sortable

In list/page.tsx, first we create an array containing three columns and map the array to each column. We can define the type of the array to avoid type errors.

Then we use a NextLink, instead of our customed Link, to wrap the column headers.

To set the href of each column header, if we use object literal, the sort parameter replace filter parameter (if exists). For example, we choose a filter status and then click column header, the new query only contains column header parameter. We need to append sort parameter to current search parameter. We use Link component offered by Next.js, it has href attribute and we can pass a UrlObject to it.

```
interface UrlObject {
  pathname?: string;
  query?: { [key: string]: any };
  hash?: string;
}
```

Pathname is current route's pathname by default.

Second line means the query object is an object with dynamic string keys, and values of any type (string, number or array). Dynamic means that we don't know its name ahead. We use 'orderBy' here because Prisma uses an 'orderBy' option in its query.

We also need to specify orderBy property in searchParams in Props.

Finally we add an inline Arrow from react icons.

**Improve IssueStatusFilter**

Currently, we hard code the url in this component. When we click column header and then choose filter type, the search parameter only contains filter type. This component is client component, so we use useSearchParams to get current search parameters. We also use URLSearchParams to create a new search parameter and append filter type to it.

**Change sort order**

Add a sortOrder prop in searchParams, it is either 'asc' or 'desc'.

Destruct searchParams and add it to prisma query.

Toggle sortOrder in query.

Change the class name of arrow icon.

## Further work

1. Update the status of an issue in edit issue page
