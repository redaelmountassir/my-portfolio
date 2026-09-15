import { useContext, useEffect } from "react";
import { MobileContext } from "../../store/MobileContext";
import { InternalWindowDataContext } from "../window/Window";
import PDFNoSupport from "./PDFNoSupport";

const PDFReader = () => {
	const { setTitle, sysObj } = useContext(InternalWindowDataContext) ?? {};
	useEffect(
		() => setTitle && sysObj && setTitle(`${sysObj.name}.pdf - PDF Reader`),
		[sysObj],
	);

	const mobile = useContext(MobileContext);

	if (mobile) return <PDFNoSupport />;
	return (
		<object
			data="./resume.pdf"
			type="application/pdf"
			width="100%"
			height="100%"
			className="flex-1"
		>
			<iframe
				src="./resume.pdf"
				width="100%"
				height="100%"
				className="h-full flex-1 border-none"
			>
				<PDFNoSupport />
			</iframe>
		</object>
	);
};

export default PDFReader;
