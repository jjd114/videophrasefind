const ListElem = () => {
    return (
        <div className="p-3 flex items-center">
            <div className="w-[121px] h-[90px] rounded-xl bg-[#ffffff1f]">
            </div>
            <div className="ml-5">
                <div className="text-white text-xl font-semibold">
                    The evolution of the human
                </div>
                <div className="text-base text-[#101824] flex justify-center items-center mt-5 w-[52px] h-[28px] rounded-md bg-[#9DA3AE]">
                    0:00
                </div>
            </div>
        </div>
    );
}

const Content = () => {
    return (
        <div className="py-6 px-10 bg-[#212A36] h-full w-[100%] max-w-[627px]">
            <div className="text-white text-xl font-semibold h-[48px]">
                Results:  1000
            </div>
            <div className="w-[100%] h-[379px] rounded-[20px] bg-[#ffffff1f] mt-3">
            </div>
            <div className="w-[100%] h-106 mt-5">
                <ListElem />
                <ListElem />
                <ListElem />
                <ListElem />
            </div>
        </div>
    );
  };
  
  export default Content;