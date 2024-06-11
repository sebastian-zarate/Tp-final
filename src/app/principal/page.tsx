'use client'
import { useEffect } from "react";
import DynamicButton from "./dynamicButton";
import { getReturnByCooki } from "@/services/users";

function Principal() {
    // Marca este componente como un componente del lado del cliente

    return (
        <div>
            <DynamicButton />
        </div>
    );
}


export default Principal;
