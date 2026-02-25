//only needed for classic uses and not needed for byPrefixAndName method

import { library, config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // important (prevents auto CSS injection)
config.autoAddCss = false;
