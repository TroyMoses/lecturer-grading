import Link from "next/link";
import React from "react";
import { Doc } from "../../../convex/_generated/dataModel";

const ApplyButton = ({ id }: { id: Doc<"jobs"> }) => {

  return (
    <div>
      <Link href={`/jobs/application/${id}`}
        className="px-10 rounded-lg py-3 bg-blue-600 text-white font-semibold transition-all duration-500 hover:bg-blue-900"
      >
        Apply Now
      </Link>
    </div>
  );
};

export default ApplyButton;
