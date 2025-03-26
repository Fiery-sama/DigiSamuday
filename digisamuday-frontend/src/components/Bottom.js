
import { Footer, FooterBrand, FooterCopyright, FooterDivider } from "flowbite-react";

export default function MainFooter() {
  return (
    <Footer container className="mx-auto rounded-sm h-18 bg-zinc-800 shadow-2xl">
      <div className="w-full text-center">
        <div className="w-full  justify-between sm:flex sm:items-center sm:justify-between">
          <FooterBrand
            href="/"
            src="../img/S.png"
            alt="DigiSamuday"
            className="hover:brightness-150"
          >
            <span className="text-red-600 font-sans font-bold text-2xl">Digi<span className="text-slate-300">Samuday</span></span>
            </FooterBrand>
        </div>
        <FooterDivider className="border-red-200"/>
        <FooterCopyright href="https://www.linkedin.com/in/iamsuhailkhan1864/" by="Suhail Khan™" year={2025} className="text-white hover:text-red-500"/>
      </div>
    </Footer>
  );
}
