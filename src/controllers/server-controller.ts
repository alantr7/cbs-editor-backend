import { createToken } from "../utils/jwt";
import { v7 as uuid } from "uuid";
import { JwtServerClaims } from "../types/jwt-claims-types";
import { Controller } from "../types/controller";

export const handleServerCreate: Controller = (req, res) => {
    const version = req.body.version;
    if (typeof version !== 'string') {
        res.status(401).end();
        return;
    }

    res.status(200).send(
        createToken<JwtServerClaims>({
            id: uuid(),
            version,
        }, 3 * 60 * 60)
    );
}