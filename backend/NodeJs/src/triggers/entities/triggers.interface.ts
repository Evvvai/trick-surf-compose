export interface TriggersI {
  id: number;
  name: string | null;
  alternativeName: string | null;
  src: string | null;
  x: number | null;
  y: number | null;
  z: number | null;
  mapId: number;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  // hopTriggers: HopTriggers[];
  // routes: Routes[];
  // triggersTimeSpeedTouches: TriggersTimeSpeedTouch[];
  // triggersTimeSpeedTouches2: TriggersTimeSpeedTouch[];
  // suggestedRoutes: SuggestedRoutes[];
  // map: Maps;
}
