import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    global: {
      ripple: false
    },
    VBtn: {
      elevation: 0
    },
    VCard: {
      elevation: 0
    },
    VChip: {
      elevation: 0
    }
  },
  theme: {
    defaultTheme: "expressa",
    themes: {
      expressa: {
        dark: false,
        colors: {
          background: "#1847e8",
          surface: "#ffffff",
          primary: "#1847e8",
          secondary: "#ff5500",
          success: "#00a854"
        }
      }
    }
  }
});
