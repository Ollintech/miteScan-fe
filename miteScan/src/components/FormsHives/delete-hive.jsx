import HiveForm from "../FormsHives/form-hive";

export default function DeleteHiveCard() {
  const formData = {
    name: 'COLMEIA 1',
    size: 'Large',
    beeType: 'BOMBUS TEMERIUS',
    location: { lat: -24.708450, lng: -48.002531 },
  };

  return (
    <HiveForm
      title="DESEJA EXCLUIR ESTA COLMEIA?"
      formData={formData}
      readOnly={true}
      onSubmit={() => alert('Excluir colmeia')}
      submitLabel="EXCLUIR"
      submitColor="bg-red-500"
      showCamera={false}
    />
  );
}
