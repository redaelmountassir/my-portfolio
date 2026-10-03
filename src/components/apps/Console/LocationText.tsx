import type { Path } from "../../../store/types";

const LocationText = (props: { location: Path }) => {
	return `${props.location.join("/")}$ `;
};

export default LocationText;
