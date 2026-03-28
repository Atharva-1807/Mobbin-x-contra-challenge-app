import svgPaths from "./svg-jbsu1zdd29";
import imgRectangle16 from "figma:asset/c35bc89ad5ebed2ca0d8fb2db7c91aa36e5761bd.png";
import imgRectangle82 from "figma:asset/64eb272aa271690d78b629a8b60b1847001dc1ee.png";
import imgRectangle86 from "figma:asset/a0fccfce72939b41f7b57a72dba1bcde0e37ce35.png";
import imgRectangle85 from "figma:asset/a3d6af3571b34fbe54764ba53e6c288ae878524c.png";
import imgRectangle83 from "figma:asset/ad6ae33579b48bf4fc8c0aaa5ed952ec3d4845b7.png";
import imgRectangle84 from "figma:asset/6045c995cd3280cec00560453883580c1877efe1.png";

function Group1() {
  return (
    <div className="absolute contents left-0 top-[593px]">
      <div className="absolute bg-[#d9d9d9] border border-black border-solid h-[75px] left-0 top-[593px] w-[402px]" />
    </div>
  );
}

function Home() {
  return (
    <div className="col-1 ml-[6px] mt-0 relative row-1 size-[29px]" data-name="Home">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 29">
        <g id="Home">
          <path d={svgPaths.p96fbe00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <p className="col-1 font-['Satoshi_Variable:Medium',sans-serif] font-medium leading-[1.1] ml-0 mt-[29px] relative row-1 text-[15px] text-black whitespace-nowrap">Home</p>
      <Home />
    </div>
  );
}

function Map() {
  return (
    <div className="col-1 ml-[15px] mt-0 relative row-1 size-[29px]" data-name="Map">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 29">
        <g clipPath="url(#clip0_8_124)" id="Map">
          <g id="Vector" />
          <path d={svgPaths.p34b22b00} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_8_124">
            <rect fill="white" height="29" width="29" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <p className="col-1 font-['Satoshi_Variable:Medium',sans-serif] font-medium leading-[1.1] ml-0 mt-[29px] relative row-1 text-[15px] text-black whitespace-nowrap">Discover</p>
      <Map />
    </div>
  );
}

function BookmarkBorder() {
  return (
    <div className="col-1 ml-[6px] mt-0 relative row-1 size-[29px]" data-name="Bookmark border">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 29">
        <g clipPath="url(#clip0_8_329)" id="Bookmark border">
          <g id="Vector" />
          <path d={svgPaths.p23efc080} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_8_329">
            <rect fill="white" height="29" width="29" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <p className="col-1 font-['Satoshi_Variable:Medium',sans-serif] font-medium leading-[1.1] ml-0 mt-[29px] relative row-1 text-[15px] text-black whitespace-nowrap">Saved</p>
      <BookmarkBorder />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.75 24.1667">
        <g id="Group">
          <path d={svgPaths.pda2600} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CalendarMonth() {
  return (
    <div className="col-1 ml-[17px] mt-0 overflow-clip relative row-1 size-[29px]" data-name="Calendar month">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 29">
        <g id="Group">
          <g id="Vector" />
        </g>
      </svg>
      <Group />
    </div>
  );
}

function Group5() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <p className="col-1 font-['Satoshi_Variable:Medium',sans-serif] font-medium leading-[1.1] ml-0 mt-[29px] relative row-1 text-[15px] text-black whitespace-nowrap">Calendar</p>
      <CalendarMonth />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex gap-[48px] items-center leading-[0] left-[28px] top-[609px]">
      <Group2 />
      <Group3 />
      <Group4 />
      <Group5 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[209px] p-[10px] top-[296px]">
      <p className="font-['Satoshi_Variable:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[10px] text-white whitespace-nowrap">TEKA Matcha</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[211px] p-[10px] top-[158px]">
      <p className="font-['Satoshi_Variable:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[10px] text-white whitespace-nowrap">Still Coffee</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[24px] p-[10px] top-[116px]">
      <p className="font-['Satoshi_Variable:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[10px] text-white whitespace-nowrap">Navu Project</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[87px] p-[10px] top-[389px] w-[80px]">
      <p className="flex-[1_0_0] font-['Satoshi_Variable:Medium',sans-serif] font-medium leading-[1.1] min-h-px min-w-px relative text-[10px] text-center text-white">Si Nonna’s pizzeria</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[15px] p-[10px] top-[234px]">
      <p className="font-['Satoshi_Variable:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[10px] text-white whitespace-nowrap">Sando Club</p>
    </div>
  );
}

export default function DiscoverView() {
  return (
    <div className="bg-black relative size-full" data-name="Discover view - 1">
      <p className="absolute font-['Satoshi_Variable:Medium',sans-serif] font-medium leading-[1.1] left-[64px] text-[24.348px] text-black top-[567px] whitespace-nowrap">Si Nonna’s pizzeria</p>
      <p className="absolute font-['Satoshi_Variable:Medium',sans-serif] font-medium leading-[1.1] left-[64px] text-[24.348px] text-black top-[601px] whitespace-nowrap">4.5/5</p>
      <div className="absolute h-[582px] left-[12px] top-[12px] w-[377px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle16} />
      </div>
      <Group1 />
      <Frame5 />
      <div className="absolute bg-[#d9d9d9] border border-black border-solid h-[85px] left-[214px] rounded-[6px] top-[79px] w-[65px]" />
      <div className="absolute bg-[#d9d9d9] border border-black border-solid h-[85px] left-[31px] rounded-[6px] top-[36px] w-[65px]" />
      <div className="absolute bg-[#d9d9d9] border border-black border-solid h-[85px] left-[94px] rounded-[6px] top-[309px] w-[65px]" />
      <div className="absolute bg-[#d9d9d9] border border-black border-solid h-[85px] left-[19px] rounded-[6px] top-[153px] w-[65px]" />
      <div className="absolute bg-[#fbf8f4] border border-[#b3b9ef] border-solid h-[85px] left-[216px] rounded-[6px] top-[214px] w-[65px]" />
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame4 />
      <Frame3 />
      <div className="absolute h-[77px] left-[219px] rounded-[6px] top-[83px] w-[55px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[6px] size-full" src={imgRectangle82} />
      </div>
      <div className="absolute h-[77px] left-[24px] rounded-[6px] top-[157px] w-[55px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[6px] size-full" src={imgRectangle86} />
      </div>
      <div className="absolute h-[77px] left-[36px] rounded-[6px] top-[40px] w-[55px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[6px] size-full" src={imgRectangle85} />
      </div>
      <div className="absolute h-[77px] left-[221px] rounded-[6px] top-[218px] w-[55px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[6px] size-full" src={imgRectangle83} />
      </div>
      <div className="absolute h-[77px] left-[99px] rounded-[6px] top-[313px] w-[55px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[6px] size-full" src={imgRectangle84} />
      </div>
    </div>
  );
}