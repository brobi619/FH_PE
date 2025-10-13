import EquipmentCard from "./EquipmentCard";
import "./EquipmentList.css";

function EquipmentList({ equipment, isAdmin = false }) {
  if (!equipment?.length) {
    return <p className="text-center mt-4 text-muted">No equipment available.</p>;
  }

  return (
    <div className="equipment-list">
      {equipment.map((item) => (
        <EquipmentCard key={item.id} data={item} isAdmin={isAdmin} />
      ))}
    </div>
  );
}

export default EquipmentList;
