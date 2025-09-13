import {betterAuth} from "better-auth"
import {drizzleAdapter} from "better-auth/adapters/drizzle"
import {db} from "../db"
import { Provider } from "@radix-ui/react-tooltip"
import * as schema from "@/db/schems"
export const auth = betterAuth({
    socialProviders:{
        github:{
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google:{
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }

},
    emailAndPassword:{
        enabled: true,
    },
    database: drizzleAdapter(db,{
        provider: "pg",
        schema:{
            ...schema
        }
    }),
});
    