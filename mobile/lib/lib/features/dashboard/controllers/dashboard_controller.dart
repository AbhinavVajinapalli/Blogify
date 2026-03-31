import 'package:get/get.dart';

class DashboardController extends GetxController {
  final RxInt selectedIndex = 0.obs;

  void setSection(int index) {
    selectedIndex.value = index;
  }
}
