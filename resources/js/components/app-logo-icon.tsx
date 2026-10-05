import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="9" height="27" rx="2" />
            <rect x="15.5" y="4" width="9" height="19" rx="2" />
            <rect x="28" y="4" width="9" height="33" rx="2" />
        </svg>
    );
}
