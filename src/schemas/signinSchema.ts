import {z} from "zod"


export const signinSchema=z.object({
    identifier:z.string().length(6,'Verificate code must be 6 digits'),
    password:z.string(),
    
})