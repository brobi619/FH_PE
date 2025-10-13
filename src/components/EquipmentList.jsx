import EquipmentCard from "./EquipmentCard";
import "./EquipmentList.css";

function EquipmentList({ equipment, user, isAdmin = false, refreshEquipment }) {
  if (!equipment?.length) {
    return <p className="text-center mt-4 text-muted">No equipment available.</p>;
  }

  return (
    <div className="equipment-list">
      {equipment.map((item) => (
        <EquipmentCard
          key={item.id}
          data={item}
          user={user}
          isAdmin={isAdmin}
          refreshEquipment={refreshEquipment}
        />
      ))}
    </div>
  );
}

export default EquipmentList;
