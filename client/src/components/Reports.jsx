import React from "react";
// ✅ IMPORT: Added useOutletContext
import { useOutletContext } from "react-router-dom";
import MonthlySummary from "./MonthlySummary";

function Reports() {
    // ✅ CONTEXT: Get session data from MainLayout
    const { token, userRole } = useOutletContext();

    const isAdmin = () => userRole === "admin";

    return (
        <>
            {/* ✅ PASSING TOKEN: Send the session token to the summary component */}
            {isAdmin() && (
                <MonthlySummary token={token} />
            )}
        </>
    );
}

export default Reports;