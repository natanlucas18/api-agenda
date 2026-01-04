import { ScheduleDomain } from "./schedule.domain";

describe("ScheduleDomain", () => {
  let domain: ScheduleDomain;

  beforeEach(() => {
    domain = new ScheduleDomain();
  });

  describe("generateSlots", () => {
    it("deve gerar slots respeitando o fim do expediente", () => {
      const slots = domain.generateSlots("09:00", "10:00", 30);

      expect(slots).toEqual(["09:00", "09:30"]);
    });

    it("não deve gerar slot que ultrapasse o fim do expediente", () => {
      const slots = domain.generateSlots("09:00", "09:50", 30);

      expect(slots).toEqual(["09:00"]);
    });

    it("deve permitir granularidade diferente da duração", () => {
      const slots = domain.generateSlots("09:00", "10:00", 30, 10);

      expect(slots).toEqual([
        "09:00",
        "09:10",
        "09:20",
        "09:30",
      ]);
    });
  });

  describe("filterAvailableSlots", () => {
    it("deve remover slots que conflitam com agendamento", () => {
      const slots = ["14:00", "14:30", "15:00"];

      const result = domain.filterAvailableSlots(
        slots,
        [
          {
            start: new Date("2026-01-10T14:40"),
            end: new Date("2026-01-10T15:10"),
          },
        ],
        [],
        30
      );

      expect(result).toEqual(["14:00"]);
    });

    it("não deve permitir slot que ultrapasse o início de outro agendamento", () => {
      const slots = ["14:10"];

      const result = domain.filterAvailableSlots(
        slots,
        [
          {
            start: new Date("2026-01-10T14:40"),
            end: new Date("2026-01-10T15:10"),
          },
        ],
        [],
        30
      );

      expect(result).toEqual([]);
    });

    it("deve respeitar bloqueios com duração customizada", () => {
      const slots = ["12:00", "12:30", "13:00"];

      const result = domain.filterAvailableSlots(
        slots,
        [],
        [
          { time: "12:00", duration: 60 },
        ],
        30
      );

      expect(result).toEqual(["13:00"]);
    });

    it("deve respeitar buffer entre atendimentos", () => {
      const slots = ["14:00", "14:20", "14:40"];

      const result = domain.filterAvailableSlots(
        slots,
        [
          {
            start: new Date("2026-01-10T15:00"),
            end: new Date("2026-01-10T15:30"),
          },
        ],
        [],
        20,
        20 // buffer
      );

      expect(result).toEqual(["14:00"]);
    });

    it("deve permitir slots quando não há conflitos", () => {
      const slots = ["09:00", "09:30"];

      const result = domain.filterAvailableSlots(
        slots,
        [],
        [],
        30
      );

      expect(result).toEqual(["09:00", "09:30"]);
    });
  });
});
