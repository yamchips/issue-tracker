import Pagination from "./components/Pagination";

interface Props {
  searchParams: Promise<{ page: string }>;
}

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <>
      <div>Hello world!</div>
      <Pagination
        totalItem={100}
        pageSize={10}
        currentPage={page ? parseInt(page) : 10}
      />
    </>
  );
}
