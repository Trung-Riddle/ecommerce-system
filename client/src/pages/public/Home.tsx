import SidebarHome from "@/components/layout/Sidebar/SidebarHome";

const Home = () => {
  return (
    <div className="flex mt-20">
      <div className="flex-[20] h-full">
        <SidebarHome />
      </div>
      <div className="flex-[80] h-[2500px]"></div>
    </div>
  );
};

export default Home;
