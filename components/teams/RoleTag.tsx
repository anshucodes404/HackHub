

interface RoleTagProps {
    role: "member" | "leader";
}

const RoleTag = ({role} : RoleTagProps) => {
  return (
    <div className={`py-0.5 w-16 rounded-full border text-xs text-center font-medium ${role === "leader" ? "bg-blue-100 text-blue-800 border-blue-600" : "bg-green-100 text-green-800 border-green-600"}`}>
      {role}
    </div>
  )
}

export default RoleTag
