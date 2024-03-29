// Helper functions
String enumToString(Object o) => o.toString().split('.').last;

T enumFromString<T>(String key, List<T> values) =>
    values.firstWhere((v) => key == enumToString(v), orElse: () => null);

List<String> enumValues<T>(List<T> values) =>
    values.map((value) => enumToString(value)).toList();