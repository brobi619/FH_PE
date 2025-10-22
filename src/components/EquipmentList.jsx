import EquipmentCard from '/src/components/EquipmentCard.jsx';
import "./EquipmentList.css";

function EquipmentList({ equipment, user, isAdmin, refreshEquipment, isMyPage }) {
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
          isMyPage={isMyPage}
        />
      ))}
    </div>
  );
}

export default EquipmentList;
