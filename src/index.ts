import { Manager } from './Game/Utils/Manager';
import { LoadingScreen } from './scenes/LoadingScreen';

Manager.initialize();
Manager.changeScene(new LoadingScreen());


