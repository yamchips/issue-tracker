import Pagination from "./components/Pagination";

export default function Home() {
  return (
    <>
      <div>Hello world!</div>
      <Pagination totalItem={100} pageSize={10} currentPage={3} />
    </>
  );
}
