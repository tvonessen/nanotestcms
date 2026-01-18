import { SpinnerGapIcon } from '@phosphor-icons/react/dist/ssr';

const Loading = () => {
  return (
    <div className="w-full h-[calc(50vh_*_0.5)] flex items-center justify-center">
      <h2 className="flex flex-row gap-2 items-center font-semibold text-xl text-primary opacity-75">
        <SpinnerGapIcon className="spin-loader" size="24" />
        Loading...
      </h2>
    </div>
  );
};

export default Loading;
