// components/PrintableComponent.js

const PrintableComponent = ({template}: {[key: string]: string}) => {

  return (
    <div>
      {template && (
        <div dangerouslySetInnerHTML={{ __html: template }} />
      )}
    </div>
  );
};

export default PrintableComponent;
